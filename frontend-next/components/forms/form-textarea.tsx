import { Textarea, TextAreaProps } from "@heroui/react";
import { KeyboardEvent, RefObject } from "react";
import { useIntl } from "react-intl";

/**
 * FormTextareaProps interface
 * @param formRef - RefObject<HTMLFormElement>
 */
export interface FormTextareaProps extends TextAreaProps {
  formRef: RefObject<HTMLFormElement>;
}

/**
 * Textarea component that submits the form on Enter key press.
 * Shift + Enter creates a new line.
 * @param props - FormTextareaProps
 */
const FormTextarea = ({ ...props }: FormTextareaProps) => {
  const intl = useIntl();
  const formRef = props.formRef;

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key ===
        intl.formatMessage({
          id: "forms.form-textarea.enter",
          defaultMessage: "Enter",
        }) &&
      !event.shiftKey
    ) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return <Textarea onKeyDown={handleTextareaKeyDown} {...props} />;
};

export default FormTextarea;
