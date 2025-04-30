import { useUsers } from "@/hooks/Users/useUsers";

interface User {
  ID: string;
  NameUser: string;
  Email: string;
  ProfilePicture: string;
  Role: string;
  AccountType: string;
  LastLogin: string;
  Created: string;
  Updated: string;
  AccountStatus: string;
}

export const useUsersByName = (name: string) => {
  const { data } = useUsers({
    status: "All",
    correo: "All",
    rol: "All",
  });
  const dataFilter = data?.data as User[] | undefined;

  const filteredUsers = (dataFilter ?? []).filter((user) =>
    user.Email.toLowerCase().includes(name.toLowerCase().trim()),
  );

  return {
    users: name.length === 0 ? (dataFilter ?? []) : filteredUsers,
    usersCount: filteredUsers.length,
  };
};
