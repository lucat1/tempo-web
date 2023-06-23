import { DefaultConfigOptions } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'

const textClassification = {
  input: `$reset input input-bordered w-full max-w-xs focus-within:input-info formkit-invalid:input-error`,
  label: '$reset font-bold text-sm formkit-invalid:text-red-500'
}

const buttonClassification = {
  input: '$reset btn btn-info'
}

const formTheme = {
  global: {
    label: 'label label-text text-base',
    inner: '$reset my-0.5',
    help: 'px-1 text-xs',
    messages: 'list-none px-1 mt-1 mb-0',
    message: 'font-semibold mb-1',
  },
  email: textClassification,
  url: textClassification,
  password: textClassification,
  submit: buttonClassification,
  tel: textClassification,
  text: textClassification,
  textarea: {
    input: `textarea textarea-bordered resize-none w-full h-48 text-base shadow
    focus:outline-blue-500
    focus:outline-2
    formkit-invalid:border-red-200
    formkit-invalid:shadow-red-200`,
    label: `text-red-200 `
  },
};

const whitespace = (node) => {
  return node.value.trim().length > 0;
};

const minLength = (node, len) => {
  return node.value.trim().length >= len;
};

const config: DefaultConfigOptions = {
  config: {
    classes: generateClasses(formTheme),
  },
  rules: { whitespace, minLength },
};

export default config
