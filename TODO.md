# TODO — code quality (no gameplay change)

This is an **early demo**. A lot of systems were written verse-by-verse to get the hacking mini-game on screen. Items 1–5 are **refactors**: they should not change how the game plays, but they would make the code consistent and cheaper to extend. Item 6 (Cannon → Havok) is an evaluation, not a no-op swap.

Do not mix these with feature work. Each refactor item is “same behavior, clearer structure.”

---

## 1. Enemy lifecycle as a real abstract API

`src/core/enemy/Enemy.ts` is already an abstract class, but **spawn / damage / death still dump everything into a few methods** with `enemy_type` switches (sphere vs box vs rocket vs cylinder-bomb, which audio engine, which effect).

**Goal:** one template per event, with hooks subclasses (or configs) can override:

| Event | Split into |
|---|---|
| Spawn | `onSpawn` → `onSpawnSound` → `onSpawnEffects` (then iframes / shooter enable) |
| Damage | `onDamage` → `onDamageSound` → `onDamageEffect` (shield hit stays a separate path) |
| Death | `onDeath` → `onDeathSound` → `onDeathEffect` |

Today `onSpawn` mixes animation selection, default vs config sounds, and iframes. `onDamage` mixes HP, shield VFX, type-specific hit VFX, and audio. `destroyEffects()` is a long type switch.

Concrete models (`EnemySphere`, `EnemyBox`, `EnemyCylinder`, bombs, shields, bosses) should only implement **what is different**, not copy the whole pipeline.

---

## 2. Shared abstract `Effect` (`src/core/effects`)

Almost every effect file redeclares a local `IEffect` (`apply(parent)`, sometimes `create` / `dispose`). `DisposableSceneEffect` + `EffectLifetime` already exist and should be the **single** base.

**Goal:**

- One exported `Effect` / `IEffect` in `src/core/effects` (not copy-pasted per file)
- All VFX extend that base (`EnemyDestroyEffect`, `EnemyDamageEffect`, `PlayerDamageEffect`, wall appearance, bullet hits, …)
- Verse `objects/effects.ts` files only **compose** effects, they do not invent new base types

This is structure only: same shaders, timings, and pools.

---

## 3. Abstract walls (`src/core/static/Walls.ts`)

`Walls` is one class that branches on type: box / cylinder / lava / invisible / animated, plus duplicated impostor setup (`BoxImpostor` vs `MeshImpostor` vs `SphereImpostor`).

**Goal:** an abstract `Wall` with:

- `onSpawn` / appearance effect
- physics setup
- shadow caster rules
- dispose / pool

Concrete types (`BoxWall`, `CylinderWall`, `LavaWall`, …) instead of `createNormalWall` vs `createLawaWall` copies. Verse configs in `src/verses/*/objects/walls.ts` can stay data; only the **runtime class** needs a hierarchy.

---

## 4. One physics / kinematics module (plane · cylinder · sphere)

Movement on the three hacking surfaces is implemented **three times**:

| Surface | Player | Enemy | Bullet |
|---|---|---|---|
| Plane | `PlayerMovementPlane` | branches inside `EnemyMovement` | `PlaneBullet` |
| Cylinder | `PlayerMovementCylinder` | same | `CylinderBullet` |
| Sphere | `PlayerMovementSphere` | same | `SphereBullet` |

Each copy has its own tangent / radius / inside-vs-outside (`is_inside_ground`) math, plus **Cannon impostors** recreated in `PlayerModel` and every `Enemy*` model (`SphereImpostor`, `BoxImpostor`, …).

**Goal:** one module, e.g. `src/core/physics/`, that owns:

- plane / cylinder / sphere **integration** (position + orientation)
- shared **impostor helpers** (mass, kinematic vs static)
- used by Player, Enemy, and Bullet

Player input and enemy AI stay in their classes; they should **call** the shared surface, not reimplement it.

---

## 5. Menu / UI input: one keyboard + gamepad layer

Keyboard and gamepad handling is duplicated in:

- `src/hooks/MainMenu/useMenuTabs.ts`
- `src/hooks/MainMenu/useSystemTab.ts`
- `src/hooks/MainMenu/useVersesTab.ts`
- `src/hooks/MainMenu/useControlsUI.ts`
- plus in-game pause / verse switcher / `GamepadInputManager`

The same patterns repeat: WASD + arrows, Q/E tabs, d-pad and shoulder buttons, **hold delay then repeat** (`INITIAL_DELAY` / `REPEAT_DELAY`), `menuLockedRef`.

**Goal:** a small input helper (actions: `navigate`, `confirm`, `cancel`, `tabPrev` / `tabNext`) that both keyboard and gamepad feed. Hooks only react to actions. Repeat/hold lives in **one** place.

In-game movement can keep `GamepadInputManager` + `ControlSchemes`; this item is **UI** duplication first.

---

## 6. Evaluate migrating physics from Cannon to Havok

The scene currently enables Cannon (`CannonJSPlugin` + the `cannon` npm package). Babylon.js’s supported engine is now **Havok** (`@babylonjs/havok` / `HavokPlugin`).

This is **not a drop-in refactor**. It is worth **evaluating**, especially if item 4 (shared plane / cylinder / sphere physics) is done first — one physics module is easier to retarget than impostors copied across Player, Enemy, and walls.

**Why consider it**

- Cannon in Babylon is legacy; Havok is what current Babylon docs and tooling assume
- Better performance and more stable contacts at the mesh counts this demo already hits
- Impostor / body APIs differ (`PhysicsImpostor` vs Havok aggregates). A migration is the natural time to kill the duplicated Sphere/Box/Cylinder impostor setup

**What to check before committing**

- Player / enemy sliding on plane, cylinder, and sphere (inside and outside)
- Walls, lava, kinematic vs static bodies, `mass: 0` colliders
- Verse restart / dispose — Havok WASM + Electron is a different native surface than Cannon; re-test the access-violation path in [KNOWN_ISSUES.md](KNOWN_ISSUES.md)
- Feel: Havok will not match Cannon contact-for-contact. Treat this as a **stability/perf** change, then retune, not as “same gameplay, different file”

Keep Cannon until a spike shows Havok is clearly better on those three surfaces without new native crashes.

---

## Tracking

These do not block a demo release. Prefer the browser or Docker build until the native verse-restart crash in [KNOWN_ISSUES.md](KNOWN_ISSUES.md) is actually fixed (that *is* a behavior/stability bug, not a refactor).
