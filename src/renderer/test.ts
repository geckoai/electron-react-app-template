import { GeckoModule } from '@geckoai/core';


export class TestBService {
}

@GeckoModule({
  imports: [],
  providers: [TestBService],
  exports: [TestBService]
})
export class TestBModule {
}


@GeckoModule({
  imports: [TestBModule],
  exports: [TestBModule]
})
export class TestAModule {
  constructor(private bService: TestBService) {
  }
}