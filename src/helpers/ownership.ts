// Exported function named isOwner that takes two parameters userId and ownerId both of type string and returns a boolean value.
export const isOwner = (userId: string, ownerId: string): boolean => {
  // Compares the userId with the ownerId and returns true if they are equal, indicating that the userId is the owner.
  return userId === ownerId;
}
