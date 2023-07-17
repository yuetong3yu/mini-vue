describe('effect', () => {
  it.skip('happy path', () => {
    const age = reactive({
      age: 10,
    })
    let newAge
    effect(() => {
      newAge = age.age + 1
    })

    expect(newAge).toBe(11)
    age.age++
    expect(newAge).toBe(12)
  })
})
