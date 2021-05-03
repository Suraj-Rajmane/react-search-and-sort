import React, { useState, memo, Profiler } from "react";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState([]);
  const api = `https://randomuser.me/api`;

  const addUserHandler = async () => {
    const userData = await fetch(api, {
      method: "GET"
    });

    const userJson = await userData.json();

    // console.log(userJson.results[0]);

    const newUser = [...user, userJson.results[0]];

    setUser(newUser);
  };

  return (
    <div>
      <Button addUserHandler={addUserHandler} />

      <Profiler
        id="userList"
        onRender={(id, phase, actualDuration) => {
          console.log({ id, phase, actualDuration });
        }}
      >
        <UserList user={user} />
      </Profiler>
    </div>
  );
}

const Button = memo(({ addUserHandler }) => {
  return <button onClick={addUserHandler}>Add User</button>;
});

const UserList = ({ user }) => {
  return (
    <div>
      {user.map((userObj, index) => (
        <UserObject userObj={userObj} key={index} />
      ))}
    </div>
  );
};

const UserObject = ({ userObj }) => {
  return (
    <div>
      {userObj.name.title} {userObj.name.first} {userObj.name.last}
      <ol>
        <li>{userObj.gender}</li>
        <li>{userObj.email}</li>
      </ol>
    </div>
  );
};
