import { FormProvider, useForm } from "react-hook-form";

function Form({ children, className, onSubmit }) {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={methods.handleSubmit(onSubmit)}
        onReset={() => methods.reset()}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export default Form;
