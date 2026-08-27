function Login() {
  return (
    <div>
      <h1>Login Administrativo</h1>

      <form>
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu e-mail"
          />
        </div>

        <div>
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            placeholder="Digite sua senha"
          />
        </div>

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  )
}

export default Login