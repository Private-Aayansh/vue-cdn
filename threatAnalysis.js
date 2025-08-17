// This file serves as the main entry point for threat analysis functionality
// It ensures all modules are properly loaded and available

import ATTACK_TYPES from './attackTypes.js';
import { parseLogFile, DETECTORS, processLogData } from './threatDetectors.js';

// Make functions globally available if needed
window.ThreatAnalysis = {
    ATTACK_TYPES,
    parseLogFile,
    DETECTORS,
    processLogData
};

console.log('Threat Analysis modules loaded successfully');