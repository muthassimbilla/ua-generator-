import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Only create client if both URL and key are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    : null

export const isSupabaseAvailable = () => {
  return supabase !== null && supabaseUrl && supabaseAnonKey
}

// Database entity classes
export class BaseEntity {
  static tableName = ""

  static async list(orderBy = "-created_date") {
    if (!isSupabaseAvailable()) {
      console.warn(`Supabase not available for ${this.tableName}`)
      return []
    }

    console.log(`Fetching data from ${this.tableName}...`)

    const { data, error } = await supabase!
      .from(this.tableName)
      .select("*")
      .order(orderBy.startsWith("-") ? orderBy.slice(1) : orderBy, {
        ascending: !orderBy.startsWith("-"),
      })

    console.log(`${this.tableName} data:`, data)
    console.log(`${this.tableName} error:`, error)

    if (error) {
      console.error(`Error fetching ${this.tableName}:`, error)
      throw error
    }
    return data || []
  }

  static async create(data: any) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    console.log(`Creating ${this.tableName}:`, data)

    const { data: result, error } = await supabase!.from(this.tableName).insert(data).select().single()

    console.log(`${this.tableName} create result:`, result)
    console.log(`${this.tableName} create error:`, error)

    if (error) {
      console.error(`Error creating ${this.tableName}:`, error)
      throw error
    }
    return result
  }

  static async update(id: string, data: any) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    console.log(`Updating ${this.tableName} ${id}:`, data)

    const { data: result, error } = await supabase!
      .from(this.tableName)
      .update({ ...data, updated_date: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    console.log(`${this.tableName} update result:`, result)
    console.log(`${this.tableName} update error:`, error)

    if (error) {
      console.error(`Error updating ${this.tableName}:`, error)
      throw error
    }
    return result
  }

  static async delete(id: string) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    console.log(`Deleting ${this.tableName} ${id}`)

    const { error } = await supabase!.from(this.tableName).delete().eq("id", id)

    console.log(`${this.tableName} delete error:`, error)

    if (error) {
      console.error(`Error deleting ${this.tableName}:`, error)
      throw error
    }
    return true
  }

  static async filter(filters: any, orderBy = "-created_date") {
    if (!isSupabaseAvailable()) {
      console.warn(`Supabase not available for ${this.tableName}`)
      return []
    }

    console.log(`Filtering ${this.tableName}:`, filters)

    let query = supabase!.from(this.tableName).select("*")

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    const { data, error } = await query.order(orderBy.startsWith("-") ? orderBy.slice(1) : orderBy, {
      ascending: !orderBy.startsWith("-"),
    })

    console.log(`${this.tableName} filter result:`, data)
    console.log(`${this.tableName} filter error:`, error)

    if (error) {
      console.error(`Error filtering ${this.tableName}:`, error)
      throw error
    }
    return data || []
  }
}

export class DeviceModel extends BaseEntity {
  static tableName = "device_models"
}

export class IOSVersion extends BaseEntity {
  static tableName = "ios_versions"
}

export class AppVersion extends BaseEntity {
  static tableName = "app_versions"
}

export class Configuration extends BaseEntity {
  static tableName = "configurations"
}

export class GenerationHistory extends BaseEntity {
  static tableName = "generation_history"
}

export class BlacklistedUserAgent extends BaseEntity {
  static tableName = "blacklisted_user_agents"
}

export class User extends BaseEntity {
  static tableName = "users"

  static async me() {
    // Check if we're on the client side
    if (typeof window === "undefined") {
      throw new Error("Not authenticated")
    }

    // Check localStorage
    const storedUser = localStorage.getItem("current_user")
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (e) {
        localStorage.removeItem("current_user")
      }
    }
    throw new Error("Not authenticated")
  }

  // Simple login without OAuth for testing
  static async loginWithEmail(email: string) {
    if (!isSupabaseAvailable()) {
      throw new Error("Supabase not available")
    }

    try {
      console.log("Attempting login with email:", email)

      // First check if user exists
      const { data: existingUser, error: selectError } = await supabase!
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

      console.log("Existing user:", existingUser)
      console.log("Select error:", selectError)

      if (existingUser) {
        // User exists, store in localStorage (only on client side)
        if (typeof window !== "undefined") {
          localStorage.setItem("current_user", JSON.stringify(existingUser))
        }
        return existingUser
      }

      // User doesn't exist, create new one
      if (selectError && selectError.code === "PGRST116") {
        const newUserData = {
          email: email,
          role: email === "admin@example.com" ? "admin" : "user",
          is_approved: email === "admin@example.com" ? true : false,
        }

        console.log("Creating new user:", newUserData)

        const { data: newUser, error: insertError } = await supabase!
          .from("users")
          .insert(newUserData)
          .select()
          .single()

        console.log("New user created:", newUser)
        console.log("Insert error:", insertError)

        if (insertError) {
          console.error("Insert error:", insertError)
          throw new Error(`Failed to create user: ${insertError.message}`)
        }

        // Store new user in localStorage (only on client side)
        if (typeof window !== "undefined") {
          localStorage.setItem("current_user", JSON.stringify(newUser))
        }
        return newUser
      }

      throw selectError
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  static async login() {
    if (typeof window === "undefined") return

    const email = prompt("Enter your email for testing:")
    if (email && email.trim()) {
      try {
        const user = await this.loginWithEmail(email.trim())
        alert(`Login successful! Welcome ${user.email}`)
        window.location.reload()
      } catch (error) {
        console.error("Login failed:", error)
        alert("Login failed: " + error.message)
      }
    }
  }

  static async logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("current_user")
      window.location.reload()
    }
  }

  // Check if user is logged in
  static async getCurrentUser() {
    if (typeof window === "undefined") {
      return null
    }

    const storedUser = localStorage.getItem("current_user")
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch (e) {
        localStorage.removeItem("current_user")
      }
    }
    return null
  }
}

// Helper function to get a random element from an array
function getRandomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Example usage of the updated generateUserAgent function
async function generateUserAgent() {
  const deviceScaling = ["1.00", "2.00", "3.00"]
  const iosVersionUA = "15.0"
  const iosVersion = {
    webkit_version: "605.1.15",
    build_number: "19A5365",
    version: "15.0",
  }
  const appVersion = {
    version: "324.0",
    build_number: "123456789",
    fbrv: null, // This should be fetched from the database
  }
  const device = {
    model_name: "iPhone 12",
  }
  const language = "en_US"

  let userAgent = ""

  if (Math.random() < 0.5) {
    userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersionUA} like Mac OS X) AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} [FBAN/FBIOS;FBAV/${appVersion.version};FBBV/${appVersion.build_number};FBDV/${device.model_name};FBMD/iPhone;FBSN/iOS;FBSV/${iosVersion.version};FBSS/2;FBID/phone;FBLC/${language}]`
  } else {
    const fbss = getRandomElement(deviceScaling.map((s) => s.replace(".00", "")))
    const extra = Math.random() < 0.1 ? ";FBOP/80" : ""

    // Use FBRV from database or generate random
    let fbrv = appVersion.fbrv
    if (!fbrv) {
      // Fallback to random generation if no FBRV in database
      fbrv = Math.floor(Math.random() * 999999) + 700000000
    } else {
      // Handle partial FBRV completion
      const fbrvStr = fbrv.toString()
      if (fbrvStr.length < 9) {
        // Complete partial FBRV with random numbers
        const remainingDigits = 9 - fbrvStr.length
        const randomPart = Math.floor(Math.random() * Math.pow(10, remainingDigits))
          .toString()
          .padStart(remainingDigits, "0")
        fbrv = fbrvStr + randomPart
      }
    }

    const fbrv_part = extra ? "" : `;FBOP/5;FBRV/${fbrv}`
    const iabmv = Math.random() < 0.9 ? ";IABMV/1" : ""

    userAgent =
      `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersionUA} like Mac OS X) ` +
      `AppleWebKit/${iosVersion.webkit_version} (KHTML, like Gecko) Mobile/${iosVersion.build_number} ` +
      `[FBAN/FBIOS;FBAV/${appVersion.version};FBBV/${appVersion.build_number};FBDV/${device.model_name};FBMD/iPhone;FBSN/iOS;` +
      `FBSV/${iosVersion.version};FBSS/${fbss};FBID/phone;FBLC/${language}${extra}${fbrv_part}${iabmv}]`
  }

  console.log("Generated User Agent:", userAgent)
  return userAgent
}
