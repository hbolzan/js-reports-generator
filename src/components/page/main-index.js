function MainIndex(context) {
    const commonViews = context.views.commonViews;
    async function index() {
        const reports = await context.ReportsIndex(context).index(),
              features = await context.FeaturesIndex(context).index(),
              fullIndex = commonViews.tabs(context, { reports, features });
        return context.Dom(context, fullIndex);
    }

    return {
        index,
    };
}

export default MainIndex;
