/**
 * COSMIC FURY - Audio Engine
 * Procedural Synthwave Music & Sound Effects using Web Audio API
 */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;

        this.initialized = false;
        this.musicPlaying = false;
        this.muted = false;

        // Volume settings (0-1)
        this.volumes = {
            master: 0.7,
            music: 0.4,
            sfx: 0.8
        };

        // Music state
        this.musicNodes = [];
        this.musicInterval = null;
        this.currentBeat = 0;
        this.bpm = 120;

        // Load saved settings
        this.loadSettings();
    }

    // Initialize audio context (must be called after user interaction)
    init() {
        if (this.initialized) return;

        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();

            // Create gain nodes
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = this.volumes.master;

            this.musicGain = this.ctx.createGain();
            this.musicGain.connect(this.masterGain);
            this.musicGain.gain.value = this.volumes.music;

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.connect(this.masterGain);
            this.sfxGain.gain.value = this.volumes.sfx;

            this.initialized = true;
            console.log('Audio Engine initialized');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // ============================================
    // SOUND EFFECTS
    // ============================================

    // Laser shot sound - Soft, pleasant pew
    playShoot() {
        if (!this.initialized || this.muted) return;

        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        // Use softer sine wave instead of harsh square
        osc.type = 'sine';
        osc2.type = 'triangle';

        // Gentler frequency sweep - mid-range pitch
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

        osc2.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.06);

        // Low-pass filter to remove harshness
        filter.type = 'lowpass';
        filter.frequency.value = 1500;

        // Lower volume and faster decay
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

        osc.start(this.ctx.currentTime);
        osc2.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.08);
        osc2.stop(this.ctx.currentTime + 0.08);
    }

    // Small explosion (enemy death)
    playExplosion() {
        if (!this.initialized || this.muted) return;

        // Noise burst + low frequency boom
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseGain = this.ctx.createGain();
        noise.connect(noiseGain);
        noiseGain.connect(this.sfxGain);
        noiseGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

        // Low frequency boom
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.2);

        oscGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        noise.start(this.ctx.currentTime);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.3);
    }

    // Large explosion (boss, player death)
    playBigExplosion() {
        if (!this.initialized || this.muted) return;

        // Multiple layered sounds
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const bufferSize = this.ctx.sampleRate * 0.5;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);

                for (let j = 0; j < bufferSize; j++) {
                    data[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / bufferSize, 1.5);
                }

                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 800 - i * 200;

                const gain = this.ctx.createGain();
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.sfxGain);
                gain.gain.setValueAtTime(0.5, this.ctx.currentTime);

                noise.start(this.ctx.currentTime);
            }, i * 50);
        }

        // Deep bass boom
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.5);

        oscGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.5);
    }

    // Power-up pickup
    playPowerUp() {
        if (!this.initialized || this.muted) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = this.ctx.currentTime + i * 0.08;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

            osc.start(startTime);
            osc.stop(startTime + 0.15);
        });
    }

    // Hit sound (player takes damage)
    playHit() {
        if (!this.initialized || this.muted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.2);
    }

    // Combo sound
    playCombo(multiplier) {
        if (!this.initialized || this.muted) return;

        const baseFreq = 400 + multiplier * 50;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.15);
    }

    // Combo break sound
    playComboBreak() {
        if (!this.initialized || this.muted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'square';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.3);
    }

    // Boss warning siren
    playBossWarning() {
        if (!this.initialized || this.muted) return;

        for (let i = 0; i < 3; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'sawtooth';

            const startTime = this.ctx.currentTime + i * 0.5;
            osc.frequency.setValueAtTime(400, startTime);
            osc.frequency.linearRampToValueAtTime(800, startTime + 0.25);
            osc.frequency.linearRampToValueAtTime(400, startTime + 0.5);

            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.setValueAtTime(0.3, startTime + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

            osc.start(startTime);
            osc.stop(startTime + 0.5);
        }
    }

    // Level up sound
    playLevelUp() {
        if (!this.initialized || this.muted) return;

        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4 to G5 arpeggio

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'sine';
            osc2.type = 'triangle';
            osc.frequency.value = freq;
            osc2.frequency.value = freq * 2;

            const startTime = this.ctx.currentTime + i * 0.1;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.25, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            osc.start(startTime);
            osc2.start(startTime);
            osc.stop(startTime + 0.3);
            osc2.stop(startTime + 0.3);
        });
    }

    // Achievement unlock sound
    playAchievement() {
        if (!this.initialized || this.muted) return;

        // Fanfare
        const chord = [523.25, 659.25, 783.99]; // C major

        chord.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);

            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.8);
        });

        // Rising note
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.50, this.ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.6);
    }

    // UI click sound
    playClick() {
        if (!this.initialized || this.muted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.value = 1000;

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Special ability activation
    playAbility() {
        if (!this.initialized || this.muted) return;

        // Whoosh + power sound
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const t = i / bufferSize;
            data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.5;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.2);
        filter.Q.value = 2;

        const gain = this.ctx.createGain();
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);

        noise.start(this.ctx.currentTime);

        // Power tone
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.3);

        oscGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.4);
    }

    // ============================================
    // MUSIC SYSTEM - Procedural Synthwave
    // ============================================

    startMusic() {
        if (!this.initialized || this.musicPlaying) return;

        this.musicPlaying = true;
        this.currentBeat = 0;

        // Synthwave chord progression (Am - F - C - G)
        this.chordProgression = [
            [220.00, 261.63, 329.63],  // Am
            [174.61, 220.00, 261.63],  // F
            [261.63, 329.63, 392.00],  // C
            [196.00, 246.94, 293.66]   // G
        ];

        // Bass notes
        this.bassNotes = [110.00, 87.31, 130.81, 98.00];

        // Start the beat
        const beatInterval = 60000 / this.bpm / 4; // 16th notes
        this.musicInterval = setInterval(() => this.playBeat(), beatInterval);
    }

    stopMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
        this.musicPlaying = false;

        // Fade out any playing nodes
        this.musicNodes.forEach(node => {
            try {
                node.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
            } catch (e) { }
        });
        this.musicNodes = [];
    }

    playBeat() {
        if (!this.initialized || this.muted) return;

        const chordIndex = Math.floor(this.currentBeat / 16) % 4;
        const beatInMeasure = this.currentBeat % 16;

        // Bass on beats 0, 4, 8, 12
        if (beatInMeasure % 4 === 0) {
            this.playBassNote(this.bassNotes[chordIndex]);
        }

        // Chord stab on beats 0, 8
        if (beatInMeasure === 0 || beatInMeasure === 8) {
            this.playChord(this.chordProgression[chordIndex]);
        }

        // Arpeggio pattern
        if (beatInMeasure % 2 === 0) {
            const chord = this.chordProgression[chordIndex];
            const noteIndex = (beatInMeasure / 2) % chord.length;
            this.playArpNote(chord[noteIndex] * 2); // Octave up
        }

        // Hi-hat pattern
        if (beatInMeasure % 2 === 0) {
            this.playHiHat(beatInMeasure % 4 === 0 ? 0.15 : 0.08);
        }

        // Kick drum on 0, 8
        if (beatInMeasure === 0 || beatInMeasure === 8) {
            this.playKick();
        }

        // Snare on 4, 12
        if (beatInMeasure === 4 || beatInMeasure === 12) {
            this.playSnare();
        }

        this.currentBeat++;
    }

    playBassNote(freq) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.type = 'sawtooth';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = 400;
        filter.Q.value = 2;

        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playChord(notes) {
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.musicGain);

            osc.type = 'sawtooth';
            osc.frequency.value = freq * 2; // Octave up

            // Slight detune for thickness
            osc.detune.value = (i - 1) * 10;

            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.4);
        });
    }

    playArpNote(freq) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.type = 'square';
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.12);
    }

    playHiHat(volume) {
        const bufferSize = this.ctx.sampleRate * 0.05;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000;

        const gain = this.ctx.createGain();
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);
        gain.gain.value = volume;

        noise.start(this.ctx.currentTime);
    }

    playKick() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.15);
    }

    playSnare() {
        // Noise component
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 2000;

        const noiseGain = this.ctx.createGain();
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.musicGain);
        noiseGain.gain.value = 0.3;

        noise.start(this.ctx.currentTime);

        // Tone component
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.connect(oscGain);
        oscGain.connect(this.musicGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);

        oscGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // ============================================
    // VOLUME CONTROLS
    // ============================================

    setMasterVolume(value) {
        this.volumes.master = Math.max(0, Math.min(1, value));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volumes.master;
        }
        this.saveSettings();
    }

    setMusicVolume(value) {
        this.volumes.music = Math.max(0, Math.min(1, value));
        if (this.musicGain) {
            this.musicGain.gain.value = this.volumes.music;
        }
        this.saveSettings();
    }

    setSfxVolume(value) {
        this.volumes.sfx = Math.max(0, Math.min(1, value));
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.volumes.sfx;
        }
        this.saveSettings();
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : this.volumes.master;
        }
        this.saveSettings();
        return this.muted;
    }

    // ============================================
    // PERSISTENCE
    // ============================================

    saveSettings() {
        localStorage.setItem('cosmicFuryAudio', JSON.stringify({
            volumes: this.volumes,
            muted: this.muted
        }));
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('cosmicFuryAudio');
            if (saved) {
                const data = JSON.parse(saved);
                this.volumes = { ...this.volumes, ...data.volumes };
                this.muted = data.muted || false;
            }
        } catch (e) {
            console.warn('Could not load audio settings');
        }
    }
}

// Global audio instance
const audioEngine = new AudioEngine();
