
export const departments = [
    {
        id: 1,
        name: "Computer Science"
    },
    {
        id: 2,
        name: "Electrical Engineering"
    },
    {
        id: 3,
        name: "Mechanical Engineering"
    },
    {
        id: 4,
        name: "Civil Engineering"
    },
    {
        id: 5,
        name: "Chemical Engineering"
    },
    {
        id: 6,
        name: "Biotechnology"
    },
    {
        id: 7,
        name: "Physics"
    },
    {
        id: 8,
        name: "Mathematics"
    },
    {
        id: 9,
        name: "Chemistry"
    },
    {
        id: 10,
        name: "Biology"
    },
    {
        id: 11,
        name: "Economics"
    },
    {
        id: 12,
        name: "Political Science"
    },
    {
        id: 13,
        name: "English"
    }
]

export function calculateOverallAttendancePercentage(attendance) {
    console.log({attendance});
    if((attendance && attendance.length === 0) || attendance === null || attendance === undefined) {
      return 0;
    }

    let totalWorkingDays = 0;
    let leavesTaken = 0;

    attendance?.forEach(item => {
      totalWorkingDays += parseInt(item.totalWorkingDays);
      leavesTaken += parseInt(item.leavesTaken);
    });

    const overallAttendance = ((totalWorkingDays - leavesTaken) / totalWorkingDays) * 100;
    return overallAttendance.toFixed(1);
  }

export function calculateMonthlyAttendancePercentage(attendance) {
    if((attendance && attendance.length === 0) || attendance === null || attendance === undefined) {
      return 0;
    }

    const month = new Date().toLocaleString('default', { month: 'long' });
    const attendanceForMonth = attendance.find(item => item.month === month);
    if(!attendanceForMonth) {
      return 0;
    }
    const totalWorkingDays = attendanceForMonth.totalWorkingDays;
    const leavesTaken = attendanceForMonth.leavesTaken;
    const monthlyAttendance = ((totalWorkingDays - leavesTaken) / totalWorkingDays) * 100;
    return monthlyAttendance.toFixed(1);
  }

  export function calculateCurrentMonthLeaves(attendance) {
    if((attendance && attendance.length === 0) || attendance === null || attendance === undefined) {
      return 0;
    }

    const month = new Date().toLocaleString('default', { month: 'long' });
    const attendanceForMonth = attendance.find(item => item.month === month);
    if(!attendanceForMonth) {
      return 0;
    }
    return attendanceForMonth.leavesTaken;
  }

  export function calculatePendingLeaves(attendance, availedLeaves) {
    console.log({attendance, availedLeaves});
    if((attendance && attendance.length === 0) || attendance === null || attendance === undefined) {
      return 0;
    }

    const totalLeaves = attendance.reduce((total, item) => total + parseInt(item.leavesTaken), 0);
    return availedLeaves - totalLeaves;
  }

  export function checkIfAttendanceIsUpToDate(attendance) {
    if((attendance && attendance.length === 0) || attendance === null || attendance === undefined) {
      return false;
    }

    const month = new Date().toLocaleString('default', { month: 'long' });
    const attendanceForMonth = attendance.find(item => item.month === month);
    if(!attendanceForMonth) {
      return false;
    }
    return attendanceForMonth ? true : false;
  }


  export function convertUTCDateShortFormat(utcString) {
    const date = new Date(utcString);
  
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true // Use 12-hour format with AM/PM
    };
  
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
  
    const day = parts.find(part => part.type === 'day').value;
    const month = parts.find(part => part.type === 'month').value;
    const year = parts.find(part => part.type === 'year').value;
    const hour = parts.find(part => part.type === 'hour').value;
    const minute = parts.find(part => part.type === 'minute').value;
    const second = parts.find(part => part.type === 'second').value;
    const ampm = parts.find(part => part.type === 'dayPeriod').value;
  
    return `${day}-${month}-${year} at ${hour}:${minute}:${second} ${ampm}`;
  }
  