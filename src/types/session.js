// Session types
export const SessionType = {
  LIVE: 'live',
  EVALUATION: 'evaluation',
  RECORDING: 'recording'
};

export const Session = {
  id: '',
  userId: '',
  userName: '',
  title: '',
  type: SessionType.LIVE,
  date: '',
  startTime: '',
  endTime: '',
  duration: 0,
  amount: 0,
  notes: ''
};

export const SessionCSV = {
  userId: '',
  userName: '',
  title: '',
  type: SessionType.LIVE,
  date: '',
  startTime: '',
  endTime: '',
  notes: ''
};