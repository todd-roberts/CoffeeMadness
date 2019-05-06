export const accounts = {
    'jschrock@midwayusa.com': {
        name: 'jaymes',
        team: 'south'
    },
    'knoe@midwayusa.com': {
        name: 'kendall',
        team: 'south'
    },
    'bguinn@midwayusa.com': {
        name: 'brandy',
        team: 'south'
    },
    'shogan@midwayusa.com': {
        name: 'shahn', 
        team: 'south'
    },
    'nrollins@midwayusa.com': {
        name: 'nick',
        team: 'south'
    },
    'smunce@midwayusa.com': {
        name: 'sam', 
        team: 'west'
    },
    'teroberts@midwayusa.com': {
        name: 'todd',
        team: 'west'
    },
    'bstallo@midwayusa.com': {
        name: 'brandon',
        team: 'west'
    },
    'akunkel@midwayusa.com': {
        name: 'adam',
        team: 'west'
    },
    'clwilson@midwayusa.com': {
        name: 'chris',
        team: 'west'
    }
};

export const playerNames = Object.values(accounts).map(a => a.name);