import { useUsersByName } from "@/helpers/getUsersByName";

import { useLocation, useNavigate } from "react-router-dom";

import queryString from "query-string";

import { useFormSearch } from "./useFormSearch";

export const useSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { q = "" } = queryString.parse(location.search) as { q: string };

  const { searchText, onInputChange } = useFormSearch({
    searchText: q,
  });

  const users = useUsersByName(q);
  const usersCount = users.users.length;

  const showError = q.length > 0 && users.users.length === 0;

  const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`?q=${searchText}`);
  };

  return {
    users,
    onInputChange,
    onSearchSubmit,
    q,
    searchText,
    showError,
    usersCount,
  };
};
