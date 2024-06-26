const sleep = (milliseconds?: number): Promise<void> => {
  const ms = milliseconds || Math.floor(Math.random() * 2001) + 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default sleep;
