import 'reflect-metadata';
import { container } from 'tsyringe';
import config from './config';
import { CustomersRepository } from './models/customer';
import { CustomersService } from './services/customers';
import { OwnERC20Service } from './services/ownerc20';
import deployments from './deployments.json'
import { AuthenticationService } from './services/auth';

container.registerSingleton<CustomersRepository>(CustomersRepository);
container.register<CustomersService>(CustomersService, { useClass: CustomersService });
container.register<AuthenticationService>(AuthenticationService, {
    useValue: new AuthenticationService(
        container.resolve(CustomersRepository),
        config.JWT_SECRET
    )
});
container.register<OwnERC20Service>(OwnERC20Service, {
    useValue: new OwnERC20Service(
        config.NETWORK_URL,
        config.PRIVATE_KEY,
        deployments.contracts.OwnERC20.address,
        deployments.contracts.OwnERC20.abi
    )
});

export default container;
