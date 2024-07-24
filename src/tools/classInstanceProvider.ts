class classInstanceProvider {
  public static getInstance<T>(classType: { new (...args: any): T }, ...args: any): T {
    return new classType(...args);
  }
}

export default classInstanceProvider;
