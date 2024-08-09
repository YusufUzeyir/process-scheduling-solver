import { ganttChartInfoType, solvedProcessesInfoType } from '.';
import { rr } from './rr';

export const mqs = (
  arrivalTime: number[],
  burstTime: number[],
  priorities: number[],
  timeQuantum: number
) => {
  const highPriorityQueue = [];
  const lowPriorityQueue = [];

  const processesInfo = arrivalTime.map((item, index) => {
    const job =
      arrivalTime.length > 26
        ? `P${index + 1}`
        : (index + 10).toString(36).toUpperCase();

    return {
      job,
      at: item,
      bt: burstTime[index],
      priority: priorities[index]
    };
  });

  processesInfo.forEach(process => {
    if (process.priority >= 5) {
      highPriorityQueue.push(process);
    } else {
      lowPriorityQueue.push(process);
    }
  });

  if (highPriorityQueue.length === 0) {
    return { solvedProcessesInfo: [], ganttChartInfo: [] };
  }

  if (lowPriorityQueue.length === 0) {
    return rr(
      highPriorityQueue.map(p => p.at),
      highPriorityQueue.map(p => p.bt),
      timeQuantum
    );
  }

  const highPriorityResults = rr(
    highPriorityQueue.map(p => p.at),
    highPriorityQueue.map(p => p.bt),
    timeQuantum
  );

  const lowPriorityResults = rr(
    lowPriorityQueue.map(p => p.at),
    lowPriorityQueue.map(p => p.bt),
    timeQuantum
  );

  const combinedGanttChartInfo: ganttChartInfoType = [
    ...highPriorityResults.ganttChartInfo,
    ...lowPriorityResults.ganttChartInfo
  ];

  const combinedSolvedProcessesInfo: solvedProcessesInfoType = [
    ...highPriorityResults.solvedProcessesInfo,
    ...lowPriorityResults.solvedProcessesInfo
  ];

  return { solvedProcessesInfo: combinedSolvedProcessesInfo, ganttChartInfo: combinedGanttChartInfo };
};
