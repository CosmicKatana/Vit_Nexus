import { TimetableSession } from '../types/timetable';

/**
 * Generates an official-style Form FF957 preview dataset on-demand
 * when the user clicks "Load Template for Preview"
 */
export function generateSamplePreviewSchedule(divisionSlug: string): TimetableSession[] {
  const roomPrefix = divisionSlug.includes('CSAI') ? 'AB' : divisionSlug.includes('CS') ? 'CB' : 'MB';

  return [
    // MONDAY (1)
    {
      id: `${divisionSlug}-mon-1`,
      divisionSlug,
      weekday: 1,
      startTime: 540, // 09:00
      endTime: 590,   // 09:50
      subjectCode: 'ES26101',
      subjectName: 'Linear Algebra & Matrices',
      sessionType: 'Theory',
      room: `${roomPrefix}-201`,
      facultyInitials: 'VVS',
      facultyName: 'Dr. Vivek V. Shinde',
      facultyId: 'FAC-1025',
    },
    {
      id: `${divisionSlug}-mon-2`,
      divisionSlug,
      weekday: 1,
      startTime: 600, // 10:00
      endTime: 650,   // 10:50
      subjectCode: 'CS26102',
      subjectName: 'Computer Programming',
      sessionType: 'Theory',
      room: `${roomPrefix}-204`,
      facultyInitials: 'SKM',
      facultyName: 'Prof. Sneha K. Mule',
      facultyId: 'FAC-1108',
    },
    {
      id: `${divisionSlug}-mon-3`,
      divisionSlug,
      weekday: 1,
      startTime: 660, // 11:00
      endTime: 710,   // 11:50
      subjectCode: 'ES26103',
      subjectName: 'Logic Development & Aptitude',
      sessionType: 'Theory',
      room: `${roomPrefix}-201`,
      facultyInitials: 'PTJ',
      facultyName: 'Prof. Pradeep T. Joshi',
      facultyId: 'FAC-1094',
    },
    // Lab batch 1
    {
      id: `${divisionSlug}-mon-lab-b1`,
      divisionSlug,
      weekday: 1,
      startTime: 760, // 12:40
      endTime: 860,   // 14:20
      subjectCode: 'CS26102P',
      subjectName: 'Computer Programming Lab',
      sessionType: 'Lab',
      batch: '1',
      room: `${roomPrefix}-LAB-4`,
      facultyInitials: 'SKM',
      facultyName: 'Prof. Sneha K. Mule',
      facultyId: 'FAC-1108',
    },
    {
      id: `${divisionSlug}-mon-tut-b2`,
      divisionSlug,
      weekday: 1,
      startTime: 760, // 12:40
      endTime: 810,   // 13:30
      subjectCode: 'ES26101T',
      subjectName: 'Linear Algebra Tutorial',
      sessionType: 'Tutorial',
      batch: '2',
      room: `${roomPrefix}-202`,
      facultyInitials: 'VVS',
      facultyName: 'Dr. Vivek V. Shinde',
      facultyId: 'FAC-1025',
    },
    {
      id: `${divisionSlug}-mon-4`,
      divisionSlug,
      weekday: 1,
      startTime: 870, // 14:30
      endTime: 920,   // 15:20
      subjectCode: 'ES26104',
      subjectName: 'Applied Physics',
      sessionType: 'Theory',
      room: `${roomPrefix}-201`,
      facultyInitials: 'AKK',
      facultyName: 'Dr. Amit K. Kulkarni',
      facultyId: 'FAC-1140',
    },

    // TUESDAY (2)
    {
      id: `${divisionSlug}-tue-1`,
      divisionSlug,
      weekday: 2,
      startTime: 540, // 09:00
      endTime: 650,   // 10:50
      subjectCode: 'ES26105P',
      subjectName: 'Engineering Workshop Practice',
      sessionType: 'Lab',
      batch: '1',
      room: 'CENTRAL WORKSHOP',
      facultyInitials: 'MNP',
      facultyName: 'Dr. Milind N. Patil',
      facultyId: 'FAC-1033',
    },
    {
      id: `${divisionSlug}-tue-2`,
      divisionSlug,
      weekday: 2,
      startTime: 660, // 11:00
      endTime: 710,   // 11:50
      subjectCode: 'ES26101',
      subjectName: 'Linear Algebra & Matrices',
      sessionType: 'Theory',
      room: `${roomPrefix}-201`,
      facultyInitials: 'VVS',
      facultyName: 'Dr. Vivek V. Shinde',
      facultyId: 'FAC-1025',
    },
    {
      id: `${divisionSlug}-tue-3`,
      divisionSlug,
      weekday: 2,
      startTime: 760, // 12:40
      endTime: 810,   // 13:30
      subjectCode: 'CS26102',
      subjectName: 'Computer Programming',
      sessionType: 'Theory',
      room: `${roomPrefix}-204`,
      facultyInitials: 'SKM',
      facultyName: 'Prof. Sneha K. Mule',
      facultyId: 'FAC-1108',
    },

    // WEDNESDAY (3)
    {
      id: `${divisionSlug}-wed-1`,
      divisionSlug,
      weekday: 3,
      startTime: 540,
      endTime: 590,
      subjectCode: 'CS26102',
      subjectName: 'Computer Programming',
      sessionType: 'Theory',
      room: `${roomPrefix}-204`,
      facultyInitials: 'SKM',
      facultyName: 'Prof. Sneha K. Mule',
      facultyId: 'FAC-1108',
    },
    {
      id: `${divisionSlug}-wed-2`,
      divisionSlug,
      weekday: 3,
      startTime: 600,
      endTime: 650,
      subjectCode: 'ES26101',
      subjectName: 'Linear Algebra & Matrices',
      sessionType: 'Theory',
      room: `${roomPrefix}-201`,
      facultyInitials: 'VVS',
      facultyName: 'Dr. Vivek V. Shinde',
    },
    {
      id: `${divisionSlug}-wed-3`,
      divisionSlug,
      weekday: 3,
      startTime: 760,
      endTime: 860,
      subjectCode: 'ES26104P',
      subjectName: 'Applied Physics Lab',
      sessionType: 'Lab',
      batch: '1',
      room: `${roomPrefix}-PHY-LAB`,
      facultyInitials: 'AKK',
      facultyName: 'Dr. Amit K. Kulkarni',
    },

    // THURSDAY (4)
    {
      id: `${divisionSlug}-thu-1`,
      divisionSlug,
      weekday: 4,
      startTime: 540,
      endTime: 590,
      subjectCode: 'ES26104',
      subjectName: 'Applied Physics',
      sessionType: 'Theory',
      room: `${roomPrefix}-201`,
      facultyInitials: 'AKK',
      facultyName: 'Dr. Amit K. Kulkarni',
    },
    {
      id: `${divisionSlug}-thu-2`,
      divisionSlug,
      weekday: 4,
      startTime: 600,
      endTime: 650,
      subjectCode: 'CS26102',
      subjectName: 'Computer Programming',
      sessionType: 'Theory',
      room: `${roomPrefix}-204`,
      facultyInitials: 'SKM',
      facultyName: 'Prof. Sneha K. Mule',
    },
    {
      id: `${divisionSlug}-thu-3`,
      divisionSlug,
      weekday: 4,
      startTime: 760,
      endTime: 860,
      subjectCode: 'HS26101P',
      subjectName: 'Language Lab & Soft Skills',
      sessionType: 'Lab',
      batch: '1',
      room: `${roomPrefix}-LANG-LAB`,
      facultyInitials: 'SSG',
      facultyName: 'Prof. Shilpa S. Gore',
    },

    // FRIDAY (5)
    {
      id: `${divisionSlug}-fri-1`,
      divisionSlug,
      weekday: 5,
      startTime: 540,
      endTime: 590,
      subjectCode: 'ES26101',
      subjectName: 'Linear Algebra & Matrices',
      sessionType: 'Theory',
      room: `${roomPrefix}-201`,
      facultyInitials: 'VVS',
      facultyName: 'Dr. Vivek V. Shinde',
    },
    {
      id: `${divisionSlug}-fri-2`,
      divisionSlug,
      weekday: 5,
      startTime: 600,
      endTime: 650,
      subjectCode: 'ES26103',
      subjectName: 'Logic Development & Aptitude',
      sessionType: 'Theory',
      room: `${roomPrefix}-201`,
      facultyInitials: 'PTJ',
      facultyName: 'Prof. Pradeep T. Joshi',
    },
    {
      id: `${divisionSlug}-fri-3`,
      divisionSlug,
      weekday: 5,
      startTime: 760,
      endTime: 810,
      subjectCode: 'ES26101T',
      subjectName: 'Linear Algebra Tutorial',
      sessionType: 'Tutorial',
      batch: '1',
      room: `${roomPrefix}-201`,
      facultyInitials: 'VVS',
      facultyName: 'Dr. Vivek V. Shinde',
    },
  ];
}
