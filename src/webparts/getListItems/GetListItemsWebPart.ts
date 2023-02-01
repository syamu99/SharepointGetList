// import * as React from "react";
// import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {IPropertyPaneConfiguration,PropertyPaneTextField} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
// import { IReadonlyTheme } from "@microsoft/sp-component-base";
import styles from './components/GetListItems.module.scss'
import * as strings from "GetListItemsWebPartStrings";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Environment, EnvironmentType } from "@microsoft/sp-core-library";
// import { escape } from '@microsoft/sp-lodash-subset';



export interface IGetListItemsWebPartProps {
  description: string;
}

export interface ISPLists {
  value: ISPList[];
}
export interface ISPList {
  Title: string;
  EmployeeId: number;
  Name: string;
  HireDate: string;
  JobDescription: string;
  Date: string;
}

export default class GetListItemsWebPart extends BaseClientSideWebPart<IGetListItemsWebPartProps> {
  // private _isDarkTheme: boolean = false;
  // private _environmentMessage: string = '';
  private _getListData(): Promise<ISPLists> {
    return this.context.spHttpClient
      .get(
        this.context.pageContext.web.absoluteUrl +
          "/_api/web/lists/GetByTitle('Employee_List')/Items?$select=EmployeeId,Name,HireDate,JobDescription",
        SPHttpClient.configurations.v1
        // ?$select=EmployeeId,EmployeeName,Hire_Date,Job_Description
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
        console.log(response.json())
      });
  }

  private _renderListAsync():void {
    if (
      Environment.type === EnvironmentType.SharePoint ||
      Environment.type === EnvironmentType.ClassicSharePoint
    ) {
      this._getListData()
      .then((response) => {
        this._renderList(response.value);
        console.log(response.value)
      }).catch((err) =>{
        console.log(err)
      }
      )
    }
  }
  
  private _renderList(items: ISPList[]): void {
    let html: string =
      '<table border=2 width=100% style="font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;">';

    html +=
      '<b><th style="background-color: #af534c;" >EmployeeId</th> <th style="background-color: #af534c;">Name </th><th style="background-color: #af534c;">HireDate </th><th style="background-color: #af534c;">JobDescription </th><th style="background-color: #af534c;"></b>';

    items.forEach((item: ISPList) => {
      html += `
   <tr>             
      
       <td>${item.EmployeeId}</td>
       <td>${item.Name}</td>
       <td>${item.HireDate}</td>
       <td>${item.JobDescription}</td> 
       
       
       </tr>
       `;
    });

    html += "</table>";
    const listContainer: Element =
      this.domElement.querySelector("#BindspListItems");
    listContainer.innerHTML = html;
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div className={ styles.getListItems }>
    <div className={ styles.container }>
      <div className={ styles.row }>
        <div class={ styles.column }>
          <span class={ styles.title }>VIEW DATA</span>
          </div>
          <br/>
          <br/>
          <br/>
          <div id="BindspListItems" />
          </div>
          </div>
          </div>`;
          this._renderListAsync();
   }

  protected get dataVersion(): Version {
  return Version.parse('1.0');
}
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
              PropertyPaneTextField('description', {
                label: strings.DescriptionFieldLabel
              })
            ]
          }
        ]
      }
    ]
  };
}
}


//   public render(): void {
//     const element: React.ReactElement<IGetListItemsProps> = React.createElement(
//       GetListItems,
//       {
//         description: this.properties.description,
//         isDarkTheme: this._isDarkTheme,
//         environmentMessage: this._environmentMessage,
//         hasTeamsContext: !!this.context.sdks.microsoftTeams,
//         userDisplayName: this.context.pageContext.user.displayName,
//       }
//     );

//     ReactDom.render(element, this.domElement);
//   }

//   protected onInit(): Promise<void> {
//     return this._getEnvironmentMessage().then((message) => {
//       this._environmentMessage = message;
//     });
//   }

//   private _getEnvironmentMessage(): Promise<string> {
//     if (!!this.context.sdks.microsoftTeams) {
//       // running in Teams, office.com or Outlook
//       return this.context.sdks.microsoftTeams.teamsJs.app
//         .getContext()
//         .then((context) => {
//           let environmentMessage: string = "";
//           switch (context.app.host.name) {
//             case "Office": // running in Office
//               environmentMessage = this.context.isServedFromLocalhost
//                 ? strings.AppLocalEnvironmentOffice
//                 : strings.AppOfficeEnvironment;
//               break;
//             case "Outlook": // running in Outlook
//               environmentMessage = this.context.isServedFromLocalhost
//                 ? strings.AppLocalEnvironmentOutlook
//                 : strings.AppOutlookEnvironment;
//               break;
//             case "Teams": // running in Teams
//               environmentMessage = this.context.isServedFromLocalhost
//                 ? strings.AppLocalEnvironmentTeams
//                 : strings.AppTeamsTabEnvironment;
//               break;
//             default:
//               throw new Error("Unknown host");
//           }

//           return environmentMessage;
//         });
//     }

//     return Promise.resolve(
//       this.context.isServedFromLocalhost
//         ? strings.AppLocalEnvironmentSharePoint
//         : strings.AppSharePointEnvironment
//     );
//   }

//   protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
//     if (!currentTheme) {
//       return;
//     }

//     this._isDarkTheme = !!currentTheme.isInverted;
//     const { semanticColors } = currentTheme;

//     if (semanticColors) {
//       this.domElement.style.setProperty(
//         "--bodyText",
//         semanticColors.bodyText || null
//       );
//       this.domElement.style.setProperty("--link", semanticColors.link || null);
//       this.domElement.style.setProperty(
//         "--linkHovered",
//         semanticColors.linkHovered || null
//       );
//     }
//   }

//   protected onDispose(): void {
//     ReactDom.unmountComponentAtNode(this.domElement);
//   }

//   protected get dataVersion(): Version {
//     return Version.parse("1.0");
//   }

//   protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
//     return {
//       pages: [
//         {
//           header: {
//             description: strings.PropertyPaneDescription,
//           },
//           groups: [
//             {
//               groupName: strings.BasicGroupName,
//               groupFields: [
//                 PropertyPaneTextField("description", {
//                   label: strings.DescriptionFieldLabel,
//                 }),
//               ],
//             },
//           ],
//         },
//       ],
//     };
//   }
// }
