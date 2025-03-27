import { useUsers } from "@/hooks/useUsers";

interface User {
  ID: string;
  NameUser: string;
  Email: string;
  Role: string;
  LastLogin: string;
  Created: string;
  Updated: string;
  AccountStatus: string;
}

export const useUsersByName = (name: string) => {
  const { data } = useUsers();
  const dataFilter = data?.data as User[] | undefined;

  const filteredUsers = (dataFilter ?? []).filter((user) =>
    user.Email.toLowerCase().includes(name.toLowerCase().trim()),
  );

  return {
    users: name.length === 0 ? (dataFilter ?? []) : filteredUsers,
    usersCount: filteredUsers.length,
  };
};
