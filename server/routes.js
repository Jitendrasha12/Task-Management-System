
import UserRouterV1 from './api/v1/app/controllers/users/routes';
import TaskRouterV1 from "./api/v1/app/controllers/Task/routes";


/**
 *
 *
 * @export
 * @param {any} app
 */

export default function routes(app) {
	app.use('/v1/app/user', UserRouterV1);
	app.use("/v1/app/task", TaskRouterV1);
	return app;
}
