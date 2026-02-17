const form = document.querySelector("#deleteForm")
form.addEventListener("change", function () {
    const deleteBtn = document.querySelector("button[type='submit']")
    deleteBtn.removeAttribute("disabled")
})
