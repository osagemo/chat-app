import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { authServerUrl } from "../../api";

type WithLoginProps = {};
export type Auth = {
  token: string;
} | null;

type FormData = {
  email: string;
  password: string;
};
export const AuthContext = React.createContext({
  auth: { token: "" },
  setAuth: (auth: Auth) => {},
});

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    fetch(`${authServerUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        setAuth({ token: data.token });
        console.log(auth);
      });
  };

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-4">
        <label
          className="block text-grey-darker text-sm font-bold mb-2"
          htmlFor="username"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
          id="username"
          type="text"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="text-red text-xs italic">Please enter an email.</p>
        )}
      </div>
      <div className="mb-6">
        <label
          className="block text-grey-darker text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
          id="password"
          type="password"
          placeholder="******************"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="text-red text-xs italic">Please enter a password.</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
const WithLogin: React.FC<WithLoginProps> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>(null);

  if (auth?.token && auth.token.length > 0) {
    return (
      <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ auth: { token: "" }, setAuth }}>
      <Login />
    </AuthContext.Provider>
  );
};

export default WithLogin;
