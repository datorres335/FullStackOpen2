type Rating = 1 | 2 | 3;

interface ExerciseValues {
  periodLength: number; //the number of days
  trainingDays: number; //the number of training days
  success: boolean; //boolean value describing if the target was reached
  rating: Rating; //a rating between the numbers 1-3 that tells how well the hours are met
  ratingDescription: string; //a text value explaining the rating, you can come up with the explanations
  target: number; //the original target value
  average: number; //the calculated average time
}

const exerciseParseArguments = (args: string[]): { target: number; exerciseHours: number[] } => {
  //const isAllNumbers = args.every(value => !isNaN(Number(value)));
  const isAllNumbers = args.slice(2).every(value => !isNaN(Number(value)));
  if (args.length < 3) throw new Error('Not enough daily exercise values provided');
  if (isAllNumbers && args.length >= 3) {
    const [throwAway1, throwAway2, target, ...exerciseHours] = args.map(Number);
    return { target, exerciseHours };
  }
  throw new Error('Invalid arguments');
}

const calculateExercises = (target: number, exerciseHours: number[]) : ExerciseValues => {
  const average = exerciseHours.reduce((sum, hours) => sum + hours, 0) / exerciseHours.length;
  const ratingOf1 = average < target * 0.5;
  const ratingOf2 = average < target * 0.75;
  return {
    periodLength: exerciseHours.length,
    trainingDays: exerciseHours.filter(hours => hours > 0).length,
    success: exerciseHours.reduce((sum, hours) => sum + hours, 0) >= target,
    rating: (() => { 
      if (ratingOf1) return 1;
      if (ratingOf2) return 2;
      return 3;
    })(),
    ratingDescription: (() => {
      if (ratingOf1) return 'You need to step up your game';
      if (ratingOf2) return 'Not too bad but you can do better';
      return 'Great job brother';
    })(),
    target: target,
    average: average
  }
}

try {
  const { target, exerciseHours } = exerciseParseArguments(process.argv);
  const result = calculateExercises(target, exerciseHours);
  console.log(result);
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
//console.log(calculateExercises(2, [3, 0, 2, 4.5, 0, 3, 1]));

