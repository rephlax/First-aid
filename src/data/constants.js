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
      'Eye Pads': 2,
      'Saline Eye Wash': 5,
      'Plasters (Box)': 1,
      'Small Bandages': 2,
      'Medium Bandages': 6,
      'Large Bandages': 2,
      'Nitrile Gloves (Pairs)': 3,
      'Microporous Tape': 1,
      'Safety Pins': 6,
      'Triangular Bandage': 2,
      'Shears': 1,
      'Antiseptic Wipes': 5
    },
    burns: {
      'Burns Dressing 10x10': 2,
      'Burns Dressing 20x20': 2,
      'Low Adherent Dressing': 4,
      'Burn Gel': 5,
      'Nitrile Gloves (Pairs)': 3,
      'Conforming Bandages': 6,
      'Safety Pins': 6
    }
  };