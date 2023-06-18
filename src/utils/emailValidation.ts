
export const emailValidation = (email: string) => {
  
    if (!email) {
      return {
        isValid : false,
        errorMessage: 'Email is required'
      }
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        isValid : false,
        errorMessage: 'Email is not valid'
      }
    }
  
    return {
      isValid : true,
      errorMessage: ''
    }
}