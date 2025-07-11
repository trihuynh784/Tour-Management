export const generateOrderCode = (number: number): string => {
  return `OD${String(number).padStart(8, "0")}`;
};

export const generateTourCode = (number: number): string => {
  return `TOUR${String(number).padStart(6, "0")}`;
};
