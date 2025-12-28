import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { ProjectPage } from './pages/project-page/project-page';
import { LanguageResolver } from './core/resolvers/language.resolver';
import { languageGuard } from './core/guards/language.guard';

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
