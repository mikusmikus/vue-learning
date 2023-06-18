export const nameValidation = (name: string) => {

  if (!name) {
    return {
      isValid : false,
      errorMessage: 'Name is required'
    }
  }

  if (name.length < 3) {
    return {
      isValid : false,
      errorMessage: 'Name must be at least 3 characters long'
    }
  }

  return {
    isValid : true,
    errorMessage: ''
  }

}