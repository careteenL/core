import { VSCodeContributePoint, Contributes } from '../../../../common';
import { Injectable, Autowired } from '@ali/common-di';
import { replaceLocalizePlaceholder, PreferenceSchemaProvider, PreferenceSchema, PreferenceSchemaProperties } from '@ali/ide-core-browser';

export interface ConfigurationSnippets {
  body: {
    title: string,
    properties: any,
  };
}

@Injectable()
@Contributes('configuration')
export class ConfigurationContributionPoint extends VSCodeContributePoint<PreferenceSchema[] | PreferenceSchema> {

  @Autowired(PreferenceSchemaProvider)
  preferenceSchemaProvider: PreferenceSchemaProvider;

  contribute() {
    let configurations = this.json;
    const properties = {};
    if (!Array.isArray(configurations)) {
      configurations = [configurations];
    }
    for (const configuration of configurations) {
      if (configuration && configuration.properties) {
        for (const prop of Object.keys(configuration.properties)) {
          properties[prop] = configuration.properties[prop];
          if (configuration.properties[prop].description) {
            properties[prop].description = replaceLocalizePlaceholder(configuration.properties[prop].description);
          }
        }
        configuration.properties = properties;
        configuration.title = replaceLocalizePlaceholder(configuration.title) || '';
        this.updateConfigurationSchema(configuration);
      }
    }
  }

  private updateConfigurationSchema(schema: PreferenceSchema): void {
    this.validateConfigurationSchema(schema);
    this.preferenceSchemaProvider.setSchema(schema);
  }

  protected validateConfigurationSchema(schema: PreferenceSchema): void {
    // tslint:disable-next-line:forin
    for (const p in schema.properties) {
      const property = schema.properties[p];
      if (property.type !== 'object') {
        continue;
      }

      if (!property.default) {
        this.validateDefaultValue(property);
      }

      const properties = property.properties;
      if (properties) {
        // tslint:disable-next-line:forin
        for (const key in properties) {
          if (typeof properties[key] !== 'object') {
            delete properties[key];
          }
        }
      }
    }
  }

  private validateDefaultValue(property: PreferenceSchemaProperties): void {
    property.default = {};

    const properties = property.properties;
    if (properties) {
      // tslint:disable-next-line:forin
      for (const key in properties) {
        if (properties[key].default) {
          property.default[key] = properties[key].default;
          delete properties[key].default;
        }
      }
    }
  }
}
