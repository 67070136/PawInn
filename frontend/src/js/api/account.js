import { mutate, readData, session, setSession } from "../storage.js";
import { today } from "../demo.js";
export function login(email) {
  const user = readData().users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!user)
    throw new Error(
      "No demo account found. Try a demo account below or create one.",
    );
  setSession(user.id);
  window.dispatchEvent(new Event("pawinn:update"));
  return user;
}
export function register({ name, email }) {
  name = name.trim();
  email = email.trim().toLowerCase();
  if (name.length < 2 || name.length > 80)
    throw new Error("Enter a name between 2 and 80 characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Enter a valid email address.");
  const user = mutate((data) => {
    if (data.users.some((u) => u.email === email))
      throw new Error(
        "This email already has a demo account. Sign in instead.",
      );
    const u = { id: crypto.randomUUID(), name, email, role: "CUSTOMER" };
    data.users.push(u);
    return u;
  });
  setSession(user.id);
  window.dispatchEvent(new Event("pawinn:update"));
  return user;
}
export function logout() {
  setSession(null);
  window.dispatchEvent(new Event("pawinn:update"));
}
export function savePet(form) {
  const user = session();
  if (!user || user.role !== "CUSTOMER")
    throw new Error("Sign in as a customer to manage pets.");
  if (form.name.trim().length < 1 || form.name.trim().length > 40)
    throw new Error("Enter a pet name up to 40 characters.");
  if (!["Dog", "Cat"].includes(form.species))
    throw new Error("Choose dog or cat.");
  if (
    form.birthDate &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(form.birthDate) ||
      form.birthDate > today() ||
      !Number.isFinite(Date.parse(form.birthDate)))
  )
    throw new Error("Enter a valid birth date in the past.");
  return mutate((data) => {
    const value = {
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim().slice(0, 80),
      birthDate: form.birthDate,
      notes: form.notes.trim().slice(0, 1000),
      avatar: form.species === "Cat" ? "cat" : "dog",
    };
    if (form.id) {
      const pet = data.pets.find(
        (p) => p.id === form.id && p.ownerId === user.id,
      );
      if (!pet) throw new Error("Pet not found.");
      if (
        pet.species !== value.species &&
        data.bookings.some(
          (b) =>
            b.petId === pet.id && ["PENDING", "CONFIRMED"].includes(b.status),
        )
      )
        throw new Error(
          "Species cannot change while a pet has an active booking.",
        );
      Object.assign(pet, value);
      return pet;
    }
    const pet = { ...value, id: crypto.randomUUID(), ownerId: user.id };
    data.pets.push(pet);
    return pet;
  });
}
export function deletePet(id) {
  return mutate((data) => {
    const user = session();
    if (!data.pets.some((p) => p.id === id && p.ownerId === user?.id))
      throw new Error("Pet not found.");
    if (
      data.bookings.some(
        (b) => b.petId === id && ["PENDING", "CONFIRMED"].includes(b.status),
      )
    )
      throw new Error("A pet with an active booking cannot be removed.");
    data.pets = data.pets.filter((p) => p.id !== id);
  });
}
