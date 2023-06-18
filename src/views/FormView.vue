<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-4" novalidate>
    <div>
      <label for="name">Name*</label>
      <CustomInput v-model:value="data.name" id="name" type="text" />
      <div class="text-rose-500" v-if="errors.name">{{ errors.name }}</div>
    </div>
    <div>
      <label for="email">Email*</label>
      <CustomInput v-model:value="data.email" id="email" type="email" />
      <div class="text-rose-500" v-if="errors.email">{{ errors.email }}</div>
    </div>
    <div>
      <label for="repeatEmail">Repeat email*</label>
      <CustomInput v-model:value="data.repeatEmail" id="repeatEmail" type="email" />
      <div class="text-rose-500" v-if="errors.repeatEmail">{{ errors.repeatEmail }}</div>
    </div>
    <div>
      <label for="password">Password*</label>
      <CustomInput v-model:value="data.password" id="password" type="password" />
      <div class="text-rose-500" v-if="errors.password">{{ errors.password }}</div>
    </div>

    <CustomButton type="submit"> Submit </CustomButton>
  </form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import CustomButton from '@/components/CustomButton.vue'
import { nameValidation } from '@/utils/nameValidation'
import { emailValidation } from '@/utils/emailValidation'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = reactive({
  name: '',
  email: '',
  repeatEmail: '',
  password: ''
})

const errors = reactive({
  name: '',
  email: '',
  repeatEmail: '',
  password: ''
})

const handleSubmit = async () => {
  const { isValid: isNameValid, errorMessage: nameErrorMessage } = nameValidation(data.name)
  if (!isNameValid) {
    errors.name = nameErrorMessage
  } else {
    errors.name = ''
  }

  const { isValid: isEmailValid, errorMessage: emailErrorMessage } = emailValidation(data.email)
  if (!isEmailValid) {
    errors.email = emailErrorMessage
  } else {
    errors.email = ''
  }

  if (!isNameValid || !isEmailValid) {
    return
  }

  // post reqest to users
  // if success redirect to home
  // if error show error message

  const response = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password
    })
  })
  if (response.ok) {
    router.push('/')
    console.log('data', data)
  } else {
    const error = await response.json()
    console.log(error)
  }
}
</script>

// pabeigt pagination + single characters pages 
// pievienot theme button 
// Novalidet formu lidz
galam. 
// parbaudit otru email field + password
