import React from "react";

const Course = (props) => {
  console.log(props);
  return (
    <div>
      <Header course={props.course} />
      <Content course={props.course} />
      <Total course={props.course} />
    </div>
  );
};

export default Course;

const Content = (props) => {
  console.log(props.course.parts);
  return (
    <div>
      {props.course.parts.map((course) => (
        <Part key={course.id} course={course} />
      ))}
    </div>
  );
};

const Part = ({ course }) => {
  return (
    <div>
      <p>
        {course.name} {course.exercises}
      </p>
    </div>
  );
};
const Header = (props) => {
  return <h1>{props.course.name}</h1>;
};
const Total = (props) => {
  let total = 0;
  console.log(props.course.parts.map((course) => (total += course.exercises)));
  return <b>total of {total} exercises</b>;
};
