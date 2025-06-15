import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { defineStore } from 'pinia'
export const Login = defineStore('Login', {
  state: () => ({
    _Nome: '',
    _Token: ''
  }),
  getters: {
    Token: (state) => {
      return state._Token
    }
  },
  actions: {
    Login() {
      const auth = getAuth()
      const provide = new GoogleAuthProvider()
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log('Utente loggato')
        } else {
          signInWithPopup(auth, provide)
            .then((response) => {
              response.user.getIdToken().then((token) => {
                this._Token = token
                localStorage.setItem('Token', token)
              })
                .catch((e) => console.log(e))
            })
            .catch((e) => console.log(e))
        }
      })
    }
  }
})
