interface BMIValues {
  height: number;
  weight: number;
}

const bmiParseArguments = (args: string[]): BMIValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    console.log(`Height: ${args[2]}, Weight: ${args[3]}`);
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = weight / (height * height * 1/10000);
  console.log(`BMI is ${bmi}`);
  
  switch (true) {
    case bmi < 16:
      return 'Underweight (Severe thinness)';
    case bmi < 17:
      return 'Underweight (Moderate thinness)';
    case bmi < 18.5:
      return 'Underweight (Mild thinness)';
    case bmi < 25:
      return 'Normal range';
    case bmi < 30:
      return 'Overweight (Pre-obese)';
    case bmi < 35:
      return 'Obese (Class I)';
    case bmi < 40:
      return 'Obese (Class II)';
    default:
      return 'Obese (Class III)';
  }
};

// only run the following code if this file is run directly
// (not when imported in another file)
if (require.main === module) {
  try {
    const { height, weight } = bmiParseArguments(process.argv);
    const result = calculateBmi(height, weight);
    console.log(result);
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}