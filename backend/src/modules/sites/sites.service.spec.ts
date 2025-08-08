import { Test, TestingModule } from '@nestjs/testing';
import { SitesService } from './sites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Site } from '../../entities/site.entity';

const mockSiteRepo = {
  find: jest.fn().mockResolvedValue([]),
};

describe('SitesService', () => {
  let service: SitesService;
  let repo: typeof mockSiteRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SitesService,
        {
          provide: getRepositoryToken(Site),
          useValue: mockSiteRepo,
        },
      ],
    }).compile();

    service = module.get<SitesService>(SitesService);
    repo = module.get(getRepositoryToken(Site));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should query active sites', async () => {
    await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({
      where: { isActive: true },
      relations: ['categories', 'products', 'pages', 'images'],
    });
  });
});
