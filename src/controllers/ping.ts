interface PingResponse {
  message: string;
}

export default class PingController {
  public async getMessage(): Promise<PingResponse> {
    return {
      message: "OMAE WA MOU SHINDEIRU!",
    };
  }
}