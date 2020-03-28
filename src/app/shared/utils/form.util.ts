import {
  FormArray,
  FormControl,
  FormGroup
} from '@angular/forms';

export const validateFormGroup = (formGroup: FormGroup | FormArray): void => {

  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);

    if (control instanceof FormControl) {
      control.markAsDirty();
      control.updateValueAndValidity();
    } else if (control instanceof FormGroup) {
      validateFormGroup(control);
    } else if (control instanceof FormArray) {
      validateFormGroup(control);
    }
  });

};

export const passwordValidator = (control: FormControl) => {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (!control.value) {
    return { error: true, required: true };
  }
  if (control.value.match(passwordPattern)) {
    return {}
  } else {
    return { error: true, passwordValidator: true };
  }
};


export const convertToSlug = (title: string) => {
  if (!title) {
    return null;
  }

  title = title.trim();

  return title
      .toLocaleLowerCase('tr')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/ /g,'-')
      .replace(/[^\w-]+/g,'');
};
