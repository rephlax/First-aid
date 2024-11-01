export const locations = {
    'Knight Suite': [
      { id: 'ks-bar', name: 'Bar First Aid', type: 'firstAid' },
      { id: 'ks-kitchen-firstaid', name: 'Kitchen First Aid', type: 'firstAid' },
      { id: 'ks-kitchen-burns', name: 'Kitchen Burns Kit', type: 'burns' },
      { id: 'ks-housekeeping', name: 'Housekeeping First Aid', type: 'firstAid' }
    ],
    'Main House': [
      { id: 'mh-housekeeping', name: 'Housekeeping First Aid', type: 'firstAid' },
      { id: 'mh-office', name: 'Office First Aid', type: 'firstAid' },
      { id: 'mh-reception', name: 'Reception First Aid', type: 'firstAid' },
      { id: 'mh-eastwing', name: 'East Wing Housekeeping First Aid', type: 'firstAid' },
      { id: 'mh-kitchen-firstaid', name: 'Kitchen First Aid', type: 'firstAid' },
      { id: 'mh-kitchen-burns', name: 'Kitchen Burns Kit', type: 'burns' }
    ],
    'Spa': [
      { id: 'spa-reception', name: 'Reception First Aid', type: 'firstAid' },
      { id: 'spa-treatment', name: 'Treatment Floor First Aid', type: 'firstAid' },
      { id: 'spa-kitchen-firstaid', name: 'Kitchen First Aid', type: 'firstAid' },
      { id: 'spa-kitchen-burns', name: 'Kitchen Burns Kit', type: 'burns' },
      { id: 'spa-laundry', name: 'Laundry First Aid', type: 'firstAid' }
    ]
  };
  
  export const requiredItems = {
    firstAid: {
      'Adhesive Bandages (Assorted)': 20,
      'Sterile Gauze Pads (4x4)': 10,
      'Medical Tape': 2,
      'Scissors': 1,
      'Disposable Gloves (Pairs)': 10,
      'Antiseptic Wipes': 15,
      'Emergency Blanket': 1,
      'First Aid Guide': 1,
      'CPR Face Shield': 1,
      'Tweezers': 1,
      'Triangular Bandages': 2,
      'Safety Pins': 6,
      'Eye Wash Solution': 1,
      'Instant Cold Pack': 2
    },
    burns: {
      'Burn Dressings (Various Sizes)': 6,
      'Non-stick Sterile Dressings': 8,
      'Burn Gel Sachets': 4,
      'Clean Plastic Bags': 2,
      'Disposable Gloves (Pairs)': 6,
      'Scissors': 1,
      'Medical Tape': 2,
      'Burn Treatment Guide': 1,
      'Sterile Saline Solution': 2,
      'Gauze Bandages': 4,
      'Conforming Bandages': 3
    }
  };