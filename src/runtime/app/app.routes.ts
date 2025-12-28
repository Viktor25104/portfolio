import { Routes } from '@angular/router';
import { Main } from '../features/pages/main/main';
import { ProjectPage } from '../features/pages/project-page/project-page';
import { LanguageResolver } from '../resolvers/language.resolver';
import { languageGuard } from '../guards/language.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'en'
  },
  {
    path: ':lang/project/:id',
    component: ProjectPage,
    canActivate: [languageGuard],
    resolve: { lang: LanguageResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: ':lang',
    component: Main,
    canActivate: [languageGuard],
    resolve: { lang: LanguageResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: '**',
    redirectTo: 'en'
  }
];
