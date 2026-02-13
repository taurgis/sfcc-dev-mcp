import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './custom.css';
import Collapsible from './components/Collapsible.vue';
import ModeTabs from './components/ModeTabs.vue';
import AssistantTabs from './components/AssistantTabs.vue';
import InstructionFilesTabs from './components/InstructionFilesTabs.vue';
import DwJsonBuilder from './components/DwJsonBuilder.vue';
import ToolExplorer from './components/ToolExplorer.vue';
import SkillsList from './components/SkillsList.vue';
import QuickStartCards from './components/QuickStartCards.vue';
import QuickStartHero from './components/QuickStartHero.vue';
import Callout from './components/Callout.vue';
import HomeSections from './components/HomeSections.vue';
import NewcomerCTA from './components/NewcomerCTA.vue';

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);
    const { app } = ctx;
    app.component('Collapsible', Collapsible);
    app.component('ModeTabs', ModeTabs);
    app.component('AssistantTabs', AssistantTabs);
    app.component('InstructionFilesTabs', InstructionFilesTabs);
    app.component('DwJsonBuilder', DwJsonBuilder);
    app.component('ToolExplorer', ToolExplorer);
    app.component('SkillsList', SkillsList);
    app.component('QuickStartCards', QuickStartCards);
    app.component('Callout', Callout);
    app.component('HomeSections', HomeSections);
    app.component('NewcomerCTA', NewcomerCTA);
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(QuickStartHero)
    });
  }
};
