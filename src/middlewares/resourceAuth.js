module.exports = ({
  projectName,
  projectKey,
  projests,
}) => async (ctx, next) => {
  if (/^\/resources?(?:\/?|$)/.test(ctx.path)) {
    const name = ctx.get(projectName);
    if (!name) {
      ctx.throw(401);
    }
    const projectItem = projests[name];
    if (!projectItem || projectItem.key !== ctx.get(projectKey)) {
      ctx.throw(401);
    }
    ctx.resourceName = name;
  }
  await next();
};
