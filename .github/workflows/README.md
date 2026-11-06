# GitHub Actions work area

Owner: Member 3 (room + Docker/CI/CD).

The old empty YAML files were removed because they were not working workflows. Create one `ci.yml` here when implementing CI.

Start with checkout, Node setup, `npm ci`, `npm run build` and `npm test` in `frontend/`. Add each backend's install/test commands as the service becomes runnable. Database-backed tests should use a disposable shared test database via POSTGRES_DB, load the provided `database/init.sql`, then run `database/tests/verify.sql` before API tests. Keep demo data untouched. Run on pushes and pull requests. Keep job permissions minimal.

Jenkins handles deployment to the local Docker environment. A separate image-publishing workflow or container registry is not required for this demo.

This README does not run an Actions workflow.
