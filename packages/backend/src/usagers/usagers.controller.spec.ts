import { Test, TestingModule } from "@nestjs/testing";
import { CerfaService } from "./services/cerfa.service";
import { UsagersService } from "./services/usagers.service";
import { UsagersController } from "./usagers.controller";

describe("Usagers Controller", () => {
  it("should be defined", async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsagersController],
      providers: [
        { provide: CerfaService, useValue: {} },
        { provide: UsagersService, useValue: {} }
      ]
    }).compile();

    const controller = module.get<UsagersController>(UsagersController);

    expect(controller).toBeDefined();
  });
});