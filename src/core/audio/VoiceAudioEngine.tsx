import { ParentAudioEngine } from "./ParentAudioEngine";

const DOD2_VOICE_COUNT = 23;
const DOD2_VOICE_POOL_ID = "audio_dod2_pool";

const DOD1_VOICE_COUNT = 7;
const DOD1_VOICE_POOL_ID = "audio_dod1_pool";

export class VoiceAudioEngine extends ParentAudioEngine {
    protected async loadSounds(callback?: (message: string) => void): Promise<void> {
        if (!this.audioEngine) return;

        await this.createSound(
            "kamikaze_scream_1",
            "sounds/voice/kamikaze_scream_1.mp3",
            { maxInstances: 5, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "kamikaze_scream_2",
            "sounds/voice/kamikaze_scream_2.mp3",
            { maxInstances: 5, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "kamikaze_scream_3",
            "sounds/voice/kamikaze_scream_3.mp3",
            { maxInstances: 5, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "kamikaze_scream_4",
            "sounds/voice/kamikaze_scream_4.mp3",
            { maxInstances: 5, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "kamikaze_scream_5",
            "sounds/voice/kamikaze_scream_5.mp3",
            { maxInstances: 5, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "kamikaze_scream_6",
            "sounds/voice/kamikaze_scream_6.mp3",
            { maxInstances: 5, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "robovoice_1",
            "sounds/voice/robovoice_1.mp3",
            { maxInstances: 5, volume: 2.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "robovoice_2",
            "sounds/voice/robovoice_2.mp3",
            { maxInstances: 5, volume: 2.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "robovoice_3",
            "sounds/voice/robovoice_3.mp3",
            { maxInstances: 5, volume: 2.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "robovoice_4",
            "sounds/voice/robovoice_4.mp3",
            { maxInstances: 5, volume: 2.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "robovoice_5",
            "sounds/voice/robovoice_5.mp3",
            { maxInstances: 5, volume: 2.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "robovoice_6",
            "sounds/voice/robovoice_6.mp3",
            { maxInstances: 5, volume: 2.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "simone_laugh",
            "sounds/voice/simone_laugh.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "simone_ugh_1",
            "sounds/voice/simone_ugh_1.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "simone_ugh_2",
            "sounds/voice/simone_ugh_2.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "simone_ugh_3",
            "sounds/voice/simone_ugh_3.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "simone_laugh_1",
            "sounds/voice/simone_laugh_1.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "simone_laugh_2",
            "sounds/voice/simone_laugh_2.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );


        await this.createSound(
            "simone_laugh_3",
            "sounds/voice/simone_laugh_3.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "amusement_park_1",
            "sounds/voice/amusement_park_1.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "amusement_park_2",
            "sounds/voice/amusement_park_2.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "amusement_park_3",
            "sounds/voice/amusement_park_3.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "amusement_park_4",
            "sounds/voice/amusement_park_4.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "amusement_park_5",
            "sounds/voice/amusement_park_5.mp3",
            { maxInstances: 5, volume: 3.0, spatialEnabled: true },
            this.audioEngine,
        );

        const dod2VoiceNames: string[] = [];
        for (let i = 1; i <= DOD2_VOICE_COUNT; i++) {
            const name = `dod2_voice_${i}`;
            dod2VoiceNames.push(name);
            await this.createSound(
                name,
                `sounds/voice/${name}.mp3`,
                { maxInstances: 1, volume: 5.0 },
                this.audioEngine,
            );
        }
        this.registerSoundPool(DOD2_VOICE_POOL_ID, dod2VoiceNames);

        const dod1VoiceNames: string[] = [];
        for (let i = 1; i <= DOD1_VOICE_COUNT; i++) {
            const name = `dod1_voice_${i}`;
            dod1VoiceNames.push(name);
            await this.createSound(
                name,
                `sounds/voice/${name}.mp3`,
                { maxInstances: 1, volume: 2.0 },
                this.audioEngine,
            );
        }

        if (callback) {
            callback("Voice");
        }
    }
}
