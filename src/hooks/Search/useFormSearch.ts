import { ChangeEvent, useState } from "react";

export const useFormSearch = <T extends Record<string, unknown>>(
  initialForm: T,
) => {
  const [formState, setFormState] = useState<T>(initialForm);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
  };
};
