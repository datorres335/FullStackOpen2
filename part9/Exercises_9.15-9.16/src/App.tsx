import type { CoursePart } from "./types";

interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps) => {
  return <h1>{name}</h1>
}

const Part = ( {part}: {part: CoursePart} ) => {
  switch (part.kind) {
    case "basic":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          <em>{part.description}</em>
        </p>
      )
    case "group":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          project exercises <em>{part.groupProjectCount}</em>
        </p>
      );
    case "background":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          <em>{part.description}</em>
          <br />
          <em>{part.backgroundMaterial}</em>
        </p>
      );
    case "special":
      return (
        <p>
          <strong>{part.name} {part.exerciseCount}</strong>
          <br />
          <em>{part.description}</em>
          <br />
          required skills: {part.requirements.join(", ")}
        </p>
      )
    default:
      return <p>Unknown course part kind.</p>;
  }
}

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps) => {
  return (
    <div>
      {courseParts.map((part, index) => {
        return (
          <Part key={index} part={part} /> 
        )
      })}
    </div>
  )
}

interface TotalProps {
  totalExercises: number;
}

const Total = ({ totalExercises }: TotalProps) => {
  return (
    <p>
      Number of exercises {totalExercises}
    </p>
  )
}

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "jest"],
    kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;