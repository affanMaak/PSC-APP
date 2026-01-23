//
//  PSCApp.swift
//  PSC
//
//  Created by Abdullah on 1/18/26.
//

import SwiftUI

@main
struct PSCApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
