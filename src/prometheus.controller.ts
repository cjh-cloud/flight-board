// Custom Prometheus Controller, just to add the public decorator
// otherwise the /metrics endpoint requires auth
import { PrometheusController } from "@willsoto/nestjs-prometheus";
import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { Public } from "./common/decorators";

@Controller()
export class CustomPrometheusController extends PrometheusController {
  @Public()
  @Get()
  async index(@Res({ passthrough: true }) response: Response) {
    return super.index(response);
  }
}