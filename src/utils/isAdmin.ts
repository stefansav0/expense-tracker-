// utils/isAdmin.ts
export const ADMIN_EMAIL = "ravikumar.kumar2333@gmail.com"; // replace with your Gmail

export const isAdmin = (email: string | null | undefined) => {
  return email === ADMIN_EMAIL;
};
